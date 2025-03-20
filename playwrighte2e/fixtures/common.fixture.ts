import { test as baseTest } from '@playwright/test';
import { PageFixtures, pageFixtures } from './page.fixture';
import { StepFixtures, stepFixtures } from './step.fixture';

export type customFixtures = PageFixtures & StepFixtures;

export const test = baseTest.extend<customFixtures>({
    ...pageFixtures,
    ...stepFixtures
});