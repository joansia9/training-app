# .devcontainer/Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node

# Switch to the node user
USER node

# Install Angular CLI
# Enable CLI Autocomplete
RUN npm install -g @angular/cli
ARG USERNAME=node
RUN SOURCE="source <(ng completion script)" \
    && echo "$SOURCE" >> "/home/$USERNAME/.bashrc"

# Install Deno + FHSS CLI
ENV DENO_INSTALL=/home/node/.deno
ENV PATH=${DENO_INSTALL}/bin:${PATH}

RUN curl -fsSL https://deno.land/install.sh | sh \
 && deno install jsr:@fhss-web-team/fhss-cli -grAfn fhss

# Install Playwright
RUN npx -y playwright install --with-deps

