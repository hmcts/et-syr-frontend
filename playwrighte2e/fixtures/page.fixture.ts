
import LoginPage from '../pages/loginPage';
import ET3LoginPage from '../pages/et3LoginPage';

export type PageFixtures = {

    loginPage: LoginPage;
    et3LoginPage: ET3LoginPage;
}

export const pageFixtures = {

    loginPage: async ({page} : {page:any}, use: (page: LoginPage) => Promise<void>): Promise<void> => {
        await use(new LoginPage(page));
    },


    et3LoginPage: async ({page}: {page:any}, use: (page: ET3LoginPage) => Promise<void>): Promise<void> => {
        await use(new ET3LoginPage(page));
    },
};
