module.exports = {
  '**/*.ts?(x)': filenames => `next lint --fix ${filenames.map(file => file.split(process.cwd())[1]).join('')}`,
};