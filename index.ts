import { Application, Router, helpers } from "https://deno.land/x/oak/mod.ts";

const domains = await fetch("https://raw.githubusercontent.com/ivolo/disposable-email-domains/master/index.json").then((x) => x.json());
const wildcards = await fetch("https://raw.githubusercontent.com/ivolo/disposable-email-domains/master/wildcard.json").then((x) => x.json());

const router = new Router();
router
    .get("/email", (context) => {
        const query = helpers.getQuery(context);
        if (!query.email) {
            context.response.status = 422;
            context.response.body = { error: "Please, provide 'email' query parameter" };
        } else {
            let result = false;
            let domain = query.email;
            const splited = query.email.split('@');
            if (splited.length > 1) {
                domain = splited[1];
            }

            for (let i = 0; i < domains.length; i++) {
                if (domain.includes(domains[i])) {
                    result = true;
                    break;
                }
            }

            for (let j = 0; j < wildcards.length; j++) {
                if (domain.includes(wildcards[j])) {
                    result = true;
                    break;
                }
            }

            context.response.body = { disposable: result };
        }
    });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
