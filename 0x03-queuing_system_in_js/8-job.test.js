import kue from 'kue';
import { expect } from 'chai';
import createJobs from './8-job';

const queue = kue.createQueue();

const JobData = {
  phoneNumber: '4153518780',
  message: 'This is the code to verify your account',
};

describe('createJobs', () => {
  before(() => {
    queue.testMode.enter();
  });
  afterEach(() => {
    queue.testMode.clear();
  });
  after(() => {
    queue.testMode.exit();
  });

  it('display err message', () => {
    expect(() => {
      createJobs('HI', queue);
    }).to.throw('Jobs is not an array');
  });
  it('Correct even if array for job is empty', () => {
    expect(createJobs([], queue)).to.equal(undefined);
  });
  it('2 jobs for queue', () => {
    queue.create('JobOne', { phoneNum: '4151218782' }).save();
    queue.create('JobTwo', { mess: 'This is the code 4321 to verify your account' }).save();
    expect(queue.testMode.jobs.length).to.equal(2);
    expect(queue.testMode.jobs[0].type).to.equal('JobOne');
    expect(queue.testMode.jobs[0].data).to.eql({ phoneNum: '4151218782' });
    expect(queue.testMode.jobs[1].type).to.equal('JobTwo');
    expect(queue.testMode.jobs[1].data).to.eql({ mess: 'This is the code 4321 to verify your account' });
  });
});
