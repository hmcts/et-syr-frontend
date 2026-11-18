import { expect } from 'chai';
import express, { Express } from 'express';
import request from 'supertest';

import { AppRequest } from '../../../main/definitions/appRequest';
import { TranslationKeys } from '../../../main/definitions/constants';
import { I18Next } from '../../../main/modules/i18next';
import { Nunjucks } from '../../../main/modules/nunjucks';

const taskListApp: Express = express();
taskListApp.locals.developmentMode = false;
new Nunjucks(false).enableFor(taskListApp);
new I18Next().enableFor(taskListApp);

taskListApp.get('/task-list', (req: AppRequest, res) => {
  res.render(TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST, {
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    ...req.t(TranslationKeys.RESPONDENT_RESPONSE_TASK_LIST, { returnObjects: true }),
    sections: [
      {
        title: 'Your details',
        links: [
          { linkTxt: 'Contact details', status: 'Completed', statusColor: '--green', url: '/a', shouldShow: true },
          { linkTxt: 'Employer details', status: 'In progress', statusColor: '--yellow', url: '/b', shouldShow: true },
        ],
      },
      {
        title: 'Check and submit',
        links: [
          {
            linkTxt: 'Check your answers',
            status: 'Cannot start yet',
            statusColor: '--grey',
            url: '',
            shouldShow: false,
          },
        ],
      },
    ],
  });
});

const collapseWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

describe('Respondent response task list page', () => {
  let htmlRes: Document;

  beforeAll(async () => {
    const response = await request(taskListApp).get('/task-list');
    htmlRes = new DOMParser().parseFromString(response.text, 'text/html');
  });

  it('associates each task link with its own status using aria-describedby', () => {
    const links = htmlRes.querySelectorAll('.app-task-list__item a');

    expect(links.length).equal(2);
    expect(links[0].getAttribute('aria-describedby')).equal('task-status-1-1');
    expect(collapseWhitespace(htmlRes.getElementById('task-status-1-1').textContent)).equal('Completed');
    expect(links[1].getAttribute('aria-describedby')).equal('task-status-1-2');
    expect(collapseWhitespace(htmlRes.getElementById('task-status-1-2').textContent)).equal('In progress');
  });

  it('gives statuses of tasks that cannot be started a unique id', () => {
    const status = htmlRes.getElementById('task-status-2-1');

    expect(collapseWhitespace(status.textContent)).equal('Cannot start yet');
    expect(htmlRes.querySelectorAll('[id^="task-status-"]').length).equal(3);
  });
});
