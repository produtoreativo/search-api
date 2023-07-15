export type TRuleResolver = (
  parsed: Partial<{
    type: string
    scope: string
    subject: string
    merge: string
    header: string
    body: string
    footer: string
    notes: string[]
    references: string[]
    mentions: string[]
    revert: string
    raw: string
  }>,
  when?: string,
  value?: string | number | boolean | (string | number)[],
) => (string | boolean)[]

export interface CommitlintPluginJira {
  rules: {
    [key: string]: TRuleResolver
  }
}
declare const commitlintPluginJira: CommitlintPluginJira

export default commitlintPluginJira
