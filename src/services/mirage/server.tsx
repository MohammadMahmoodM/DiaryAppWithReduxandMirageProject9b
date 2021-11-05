import { Server, Response, Model, belongsTo, hasMany, Factory } from 'miragejs';
import user from "./routes/user";
import * as diary from "./routes/diary";

export const handleErrors = (error: any, message = "An error ocurred") => {
    console.log("Error", error);
    return new Response(400, undefined, {
        data: {
            message,
            isError: true,
        },
    });
};

export const setupServer = (env?: string): Server => {
    return new Server({
        environment: env ?? "development",

        models: {
            entry: Model.extend({
                diary: belongsTo(), // diary has many entry
            }),
            diary: Model.extend({
                entry: hasMany(), //entry has many dairy
                user: belongsTo(), // user has many diary   
            }),
            user: Model.extend({
                diary: hasMany(),  // diary has Many user
            }),
        },

        factories: {
            user: Factory.extend({
                username: "test",
                password: "password",
                email: "test@gmail.com",
            }),
        },

        seeds: (server): any => {
            server.create("user");
        },

        routes(): void {  // put here links to get, update delete
            this.urlPrefix = "https://diaries.app";

            this.get("/diaries/entries/:id", diary.getEntries); //diary comming from diary.tsx
            this.get("/diaries/:id", diary.getDiaries);

            this.post("/auth/login", user.login);
            this.post("/auth/signup", user.signup);

            this.post("/diaries/", diary.create);
            this.post("/diaries/entry/:id", diary.addEntry);

            this.put("/diaries/entry/:id", diary.updateEntry);
            this.put("/diaries/:id", diary.updateDiary);

            this.del("/diaries/:diaryId", diary.deleteDiary);
            this.del("/entries/:entryId", diary.deleteEntry);
        },
    });
}