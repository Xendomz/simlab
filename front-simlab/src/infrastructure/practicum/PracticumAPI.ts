import { Practicum } from "@/domain/practicum/Practicum";
import { StudyProgramAPI, toDomain as toStudyProgram } from "../study-program/StudyProgramAPI"

export type PracticumAPI = {
    id: number;
    code: string;
    name: string;
    prodi_id: number;
    sks: number;
    created_at: Date | null;
    updated_at: Date | null;
    study_program?: StudyProgramAPI
}

export function toDomain(api: PracticumAPI): Practicum {
    return new Practicum(
        api.id,
        api.code,
        api.name,
        api.prodi_id,
        api.sks,
        api.created_at,
        api.updated_at,
        api.study_program ?
        toStudyProgram(api.study_program) : undefined
    );
}