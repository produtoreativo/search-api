export interface Rules {
  commitStatusCase: string
  taskIdEmpty: string
  taskIdSeparator: string
  taskIdCase: string
  taskIdMaxLength: string
  taskIdMinLength: string
  commitMessageSeparator: string
  taskIdProjectKey: string
}

export interface TCommitlintJiraConstants {
  JIRA_RULES: Rules
  COMMIT_MESSAGE_SEPARATOR: string
  COMMIT_TASK_IDS_SEPARATOR: string
  COMMIT_TASK_STATUS_PATTERN: RegExp
  TASK_ID_SEPARATOR: string
  COMMIT_STATUS_SEPARATORS: {
    start: string
    end: string
  }
  UPPERCASE: string
  LOWERCASE: string
  COMMIT_DESCRIPTION_SEPARATOR: string
}

export type TParseCommitMessage = (
  commitMessage: string,
) => {
  commitTaskIds: string[]
  commitHeader: string
  commitFooter: string
  commitStatus: string
}

export interface CommitlintJiraUtils {
  parseCommitMessage: TParseCommitMessage
  commitlintJiraConstants: TCommitlintJiraConstants
}

export const commitlintJiraConstants: TCommitlintJiraConstants
export const parseCommitMessage: TParseCommitMessage

declare const commitlintJiraUtils: CommitlintJiraUtils
export default commitlintJiraUtils
