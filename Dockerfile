FROM node:24
RUN mkdir -p /opt/app && chown -R node:node /opt/app
WORKDIR /opt/app
COPY --chown=node:node package.json package-lock.json ./
USER node
# npm install is intentional: npm may omit optional dependencies for other
# architectures when it rewrites the lockfile, making cross-platform npm ci fail.
RUN npm install
COPY --chown=node:node src/ ./src/
EXPOSE 3300
CMD [ "node", "src/server.ts"]
