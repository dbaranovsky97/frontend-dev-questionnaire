import { Hobby } from "./hobby-form/hobby";

export interface FEDevQuestionnaire {
    dateOfBirth: Date;
    email: string;
    firstName: string;
    framework: string;
    frameworkVersion: string;
    hobby: Hobby[];
    lastName: string;
}