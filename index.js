const http = require('http');

function removeAccents(str) {
    return str.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

module.exports = function (parent) {
    const ipCache = {};
    const TTL_SECONDS = 1800;

    parent.AddAgentConnectionHandler(function (agent) {
        try {
            const ip = agent.req?.connection?.remoteAddress?.replace(/^::ffff:/, '');
            if (!ip || ip.startsWith("192.") || ip.startsWith("10.") || ip.startsWith("172.")) return;

            const now = Math.floor(Date.now() / 1000);
            if (ipCache[ip] && (now - ipCache[ip].timestamp < TTL_SECONDS)) {
                applyTags(parent, agent.dbid, ipCache[ip].geo);
                return;
            }

            function queryGeo(ip, attempt = 1) {
                http.get(`http://ip-api.com/json/${ip}`, (res) => {
                    let data = '';
                    res.on('data', (chunk) => data += chunk);
                    res.on('end', () => {
                        try {
                            const geo = JSON.parse(data);
                            if (geo.status !== 'success') {
                                if (attempt === 1) {
                                    console.log(`[GeoTag] 1a tentativa falhou para ${ip}, tentando novamente...`);
                                    return setTimeout(() => queryGeo(ip, 2), 3000);
                                } else {
                                    applyFallback();
                                }
                            } else {
                                ipCache[ip] = { timestamp: now, geo };
                                applyTags(parent, agent.dbid, geo);
                            }
                        } catch (e) {
                            console.log("Erro ao processar resposta geo:", e.message);
                            if (attempt === 1) {
                                return setTimeout(() => queryGeo(ip, 2), 3000);
                            } else {
                                applyFallback();
                            }
                        }
                    });
                }).on('error', (err) => {
                    console.log("Erro ao consultar geo API:", err.message);
                    if (attempt === 1) {
                        return setTimeout(() => queryGeo(ip, 2), 3000);
                    } else {
                        applyFallback();
                    }
                });
            }

            function applyFallback() {
                const geo = {
                    country: "Desconhecido",
                    region: "Desconhecido",
                    city: "Desconhecido",
                    isp: "Desconhecido"
                };
                ipCache[ip] = { timestamp: now, geo };
                applyTags(parent, agent.dbid, geo);
            }

            queryGeo(ip);

        } catch (e) {
            console.log("Erro plugin geo:", e.message);
        }
    });

    function applyTags(parent, nodeid, geo) {
        const tags = [
            `Pais: ${removeAccents(geo.country)}`,
            `Estado: ${removeAccents(geo.region)}`,
            `Cidade: ${removeAccents(geo.city)}`,
            `Provedor: ${removeAccents(geo.isp)}`
        ];

        for (const tag of tags) {
            parent.DispatchEvent([nodeid], {
                etype: 'tagchange',
                action: 'add',
                tag: tag
            });
        }
    }
};
