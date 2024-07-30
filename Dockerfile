FROM node:latest
RUN mkdir -p /opt/app && chown -R node:node /opt/app
WORKDIR /opt/app
COPY --chown=node:node package.json package-lock.json ./
USER node
RUN npm ci
COPY --chown=node:node src/ ./src/
EXPOSE 3300
CMD [ "node", "src/index.js"]
