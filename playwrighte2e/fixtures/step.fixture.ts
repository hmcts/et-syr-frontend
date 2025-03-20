import CreateCaseStep from '../steps/createAndAcceptCase';

export type StepFixtures = {

    createCaseStep: CreateCaseStep;
}

export const stepFixtures = {

    createCaseStep: async ({ page }: { page: any }, use: (page: CreateCaseStep) => Promise<void>): Promise<void> => {
        await use(new CreateCaseStep(page));
    },
};