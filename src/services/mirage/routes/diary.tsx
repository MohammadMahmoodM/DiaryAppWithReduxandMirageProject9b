import { Response, Request } from 'miragejs';
import { Diary } from '../../../interfaces/diary.interface';
import { User } from '../../../interfaces/user.interface';
import { Entry } from '../../../interfaces/entry.interface';
import dayjs from 'dayjs';
import { handleErrors } from '../server';
import Schema from 'miragejs/orm/schema';

export const create = (
    schema: any,
    req: Request // Request is function from mirage
): { user: User, diary: Diary } | Response => {
    try {
        const { title, type, userId } = JSON.parse(
            req.requestBody
        ) as Partial<Diary>;
        const exUser = schema.users.findBy({ id: userId })
        if (!exUser) {
            return handleErrors(null, "Failed to create Diary.");
        }
        const now = dayjs().format();
        const diary = exUser.createDiary({
            title,
            type,
            createdAt: now,
            updatedAt: now,
        });
        return {
            user: {
                ...exUser.attrs,  // user login
            },
            diary: diary.attrs,  // diary attribute
        };
    }
    catch (error) {
        return handleErrors(error, "Failed to create");
    }
};

export const addEntry = (
    schema: any,
    req: Request
): { updatedDiary: Diary; newEntry: Entry } | Response => {
    try {
        const diary = schema.diaries.find(req.params.id);
        const { title, content } = JSON.parse(req.requestBody) as Partial<Entry>;
        const now = dayjs().format();
        const entry = diary.createEntry({
            title,
            content,
            createdAt: now,
            updatedAt: now,
        });
        diary.update({
            ...diary.attrs,
            updatedAt: now,
        });
        return {
            updatedDiary: diary.attrs,
            newEntry: entry.attrs,
        }
    }
    catch (error) {
        return handleErrors(error, "Failed to save Entry.");
    }
};

export const getDiaries = (
    schema: any,
    req: Request
): Diary[] | Response => {  // Diary[] get all the data
    try {
        const user = schema.users.find(req.params.id);
        return user.diary as Diary[];  // user.diary jo kuch be ha Diary[] ma dal do
    } catch (error) {
        return handleErrors(error, "Could not get user diaries.");
    }
};

export const getEntries = (
    schema: any,
    req: Request
): { entries: Entry[] } | Response => {
    try {
        const diary = schema.diaries.find(req.params.id)
        return diary.entry;
    }
    catch (error) {
        return handleErrors(error, "Failed to get Diary entries.");
    }
};

export const updateDiary = (schema: any, req:Request): Diary | Response => {
    try{
        const diary = schema.diaries.find(req.params.id);
        const data = JSON.parse(req.requestBody) as Partial<Diary>;
        const now = dayjs().format();
        diary.update({
            ...data,
            updateAt: now,
        })
        return diary.attrs as Diary;
    }
    catch(error){
        return handleErrors(error, "Failed to update Diary.");
    }
};

export const updateEntry = (schema: any, req: Request): Entry | Response => {
    try{
        const entry = schema.diary.find(req.params.id);
        const data = JSON.parse(req.requestBody) as Partial<Entry>;
        const now = dayjs().format();
        entry.update({
            ...data,
            updatedAt: now,
        });
        return entry.attrs as Entry;
    }
    catch (error){
        return handleErrors(error, "Failed to update entry.");
    }
};

export const deleteDiary = (schema: any, req: Request): User | Response => {
    try{
        const diary = schema.diaries.find(req.params.diaryId);
        const userId = diary.userId;
        diary.destory();
        const user = schema.users.find(userId);

        return user.attrs as User;
    }
    catch(error){
        return handleErrors(error, "Failed to delete");
    }
};

export const deleteEntry = (schema: any, req: Request): Diary | Response => {
    try {
        const entry = schema.entries.find(req.params.entryId);
        const diaryId = entry.diaryId;
        entry.destory();
        const diary = schema.diaries.find(diaryId);

        return diary.attrs as Diary;
    }
    catch (error) {
        return handleErrors(error, "Failed to delete entry.");
    }
};