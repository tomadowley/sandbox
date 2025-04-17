import { Project } from "@/database"
import { GitHubEvent, GitHubEventMap } from "./github.event"
import { LinearEvent, LinearEventMap } from "./linear.event"
import { VercelEvent, VercelEventMap } from "./vercel.event"
import { S3LogsEvent, S3LogsEventMap } from "./s3.logs.event"
import { CeEvent, CeEventMap } from "./code.execution.event"
import { JiraEventMap, JiraEvent } from "./jira.event"
import { OnboardingStepEvent, OnboardingStepEventMap } from "./onboarding.event"
import { SlackEvent } from "@slack/web-api"
import { SlackEventMap } from "./slack.event"

export type InternalEvent = GitHubEvent &
  LinearEvent &
  JiraEvent &
  SlackEvent &
  ProjectEvent &
  ExecutorEvent &
  VercelEvent &
  S3LogsEvent &
  CeEvent &
  OnboardingStepEvent

export interface InternalEventMap
  extends GitHubEventMap,
    LinearEventMap,
    VercelEventMap,
    JiraEventMap,
    ProjectEventMap,
    ExecutorEventMap,
    S3LogsEventMap,
    CeEventMap,
    SlackEventMap,
    OnboardingStepEventMap {}

export enum ProjectEvent {
  created = "project.created",
}

interface ProjectEventMap {
  [ProjectEvent.created]: Project
}

export enum ExecutorEvent {
  execute = "executor.execute",
}

interface ExecutorEventMap {
  [ExecutorEvent.execute]: {
    taskId: string
    stepId: string
    generationId?: string
    userId?: string
  }
}