import { TextFilterPipe } from './textFilter.pipe';

describe('FilterPipe', () => {
  it('create an instance', () => {
    const pipe = new TextFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
