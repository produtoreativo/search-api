export interface CommitlintConfigJira {
  rules: {
    [key: string]: number | (number | string | boolean)[]
  }
}
declare const commitlintConfigJira: CommitlintConfigJira

export default commitlintConfigJira
