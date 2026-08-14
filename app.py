from flask import Flask, render_template

app = Flask(__name__)

projetos = [
    {
        "titulo": "CoreAgenda — SaaS de Agendamentos",
        "descricao": "Plataforma multi-tenant para gestão de agendamentos de clínicas e barbearias: integração com Google Calendar via OAuth, lembretes automáticos por WhatsApp e painel administrativo com métricas de atendimento.",
        "tags": ["Next.js", "TypeScript", "Prisma", "Supabase", "Tailwind CSS", "Google Calendar API", "Evolution API", "shadcn/ui"],
        "site": "https://coreagenda.vercel.app"
    },
    {
        "titulo": "Hambúrgueria do Zé — Delivery + Bot",
        "descricao": "Site de pedidos com pagamento integrado via Mercado Pago e painel administrativo para acompanhar e atualizar o status de cada pedido em tempo real. Focado em otimizar o fluxo de recebimento da loja e entregar uma interface rápida e atrativa para o cliente final.",
        "tags": ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Mercado Pago", "Evolution API", "Leaflet", "Framer Motion"],
        # Provisorio: o deploy ainda nao existe, mas este e o nome de projeto
        # que o proprio codigo do delivery ja usa. Ao publicar com esse nome,
        # o link passa a funcionar sem precisar mexer aqui.
        "site": "https://burguerdelivery.vercel.app"
    }
]

# Links da seção de contato. Como o site roda serverless na Vercel (sem disco
# persistente), o contato é por link direto em vez de formulário gravado em arquivo.
contatos = [
    {
        "rotulo": "E-mail",
        "valor": "joaofrancadev1@gmail.com",
        "href": "mailto:joaofrancadev1@gmail.com",
        "icone": "email"
    },
]


@app.route("/")
def index():
    return render_template(
        "index.html", nome="João França", projetos=projetos, contatos=contatos
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
