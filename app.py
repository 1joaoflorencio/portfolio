from flask import Flask
from flask import render_template

app = Flask(__name__)

projetos = [
    {
        "titulo": "Programa de Agendamento.",
        "descricao": "Um site com diversas funcoes para agendamentos de clinicas ou barbearias.",
        "link": "https://github.com/1joaoflorencio/agendamento"
    },
    {
        "titulo": "Programa baseado no iFood.",
        "descricao": "Um programa integrado com WhatsApp para agendamentos de pedidos de hamburgueria ou pizzaria, podendo acompanhar o andamento do pedido.",
        "link": "https://github.com/1joaoflorencio/bot-delivery-clean"
    }
]

@app.route("/")
def index():
    return render_template("index.html", nome = "João Pedro Florencio Franca", projetos = projetos)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)



