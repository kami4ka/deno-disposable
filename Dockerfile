FROM hayd/deno:debian-1.10.2

EXPOSE 8000

WORKDIR /app

# Prefer not to run as root.
USER deno

COPY index.ts /app

CMD ["run", "--allow-net", "index.ts"]
