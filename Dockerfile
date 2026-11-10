# API hospedada (issue #40): mesmo json-server e dados de exemplo do projeto.
FROM node:22-alpine
WORKDIR /app
RUN npm install -g json-server@1.0.0-beta.15
COPY db.seed.json ./db.json
EXPOSE 3000
# PORT é definida pelo Render; na VPS fica 3000.
CMD ["sh", "-c", "json-server db.json --host 0.0.0.0 --port ${PORT:-3000}"]
