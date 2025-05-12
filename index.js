module.exports = function (parent) {
    console.log(">> Plugin geotag (console interceptor) carregado");

    parent.AddConsoleInterceptor(function (command, args, session, token, tag, output, response) {
        try {
            const linhas = output.split(/\r?\n/);
            const geo = {};

            for (const linha of linhas) {
                if (linha.startsWith("Pais:")) geo.pais = linha.split(":")[1].trim();
                if (linha.startsWith("Estado:")) geo.estado = linha.split(":")[1].trim();
                if (linha.startsWith("Cidade:")) geo.cidade = linha.split(":")[1].trim();
                if (linha.startsWith("Provedor:")) geo.provedor = linha.split(":")[1].trim();
            }

            if (geo.pais && geo.estado && geo.cidade && geo.provedor) {
                console.log(`[GeoTag] Tags recebidas do agente ${session.nodeid}:`, geo);

                const tags = [
                    `Pais: ${geo.pais}`,
                    `Estado: ${geo.estado}`,
                    `Cidade: ${geo.cidade}`,
                    `Provedor: ${geo.provedor}`
                ];

                for (const tag of tags) {
                    parent.DispatchEvent([session.nodeid], {
                        etype: 'tagchange',
                        action: 'add',
                        tag: tag
                    });
                }
            }
        } catch (e) {
            console.log("[GeoTag] Erro ao processar tags recebidas:", e.message);
        }
    });
};
