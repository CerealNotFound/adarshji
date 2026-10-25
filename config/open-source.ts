// Zulip contributions, checked against the GitHub API on 2026-10-25.
// #37181 was a typo duplicate of #37191 and is left out.

export type ContributionStatus =
  | "merged"
  | "co-authored"
  | "continued"
  | "open"
  | "closed";

export interface Contribution {
  title: string;
  area: string;
  status: ContributionStatus;
  pr: number;
  // The PR by someone else that carried this work forward
  followUp?: { pr: number; author: string; merged: boolean };
  date: string;
}

const zulip = (n: number) => `https://github.com/zulip/zulip/pull/${n}`;
export const prUrl = zulip;

export const openSource = {
  repo: "zulip/zulip",
  repoUrl: "https://github.com/zulip/zulip",
  summary:
    "I shipped 3 merged PRs to Zulip and opened 9 more. Reviews took longer than I could keep giving them, so maintainers and contributors carried 5 of them forward, 3 with me as co-author.",
  contributions: [
    {
      title: "Update empty state text for the \"followed topics\" filter",
      area: "inbox_ui",
      status: "merged",
      pr: 37191,
      date: "2026-01-05",
    },
    {
      title: "Red shadow and border on invalid time inputs",
      area: "settings_ui",
      status: "merged",
      pr: 37418,
      date: "2026-01-13",
    },
    {
      title: "Restrict error logs for buggy_documentation_endpoints",
      area: "openapi",
      status: "merged",
      pr: 38699,
      date: "2026-03-27",
    },
    {
      title: "Autosave drafts while typing",
      area: "compose",
      status: "continued",
      pr: 37935,
      followUp: { pr: 39647, author: "evykassirer", merged: true },
      date: "2026-02-12",
    },
    {
      title: "Fix case studies menu overflow on low-height screens",
      area: "portico",
      status: "continued",
      pr: 37880,
      followUp: { pr: 38297, author: "amanagr", merged: true },
      date: "2026-02-09",
    },
    {
      title: "Convert the read receipts modal to a popover",
      area: "read_receipts",
      status: "co-authored",
      pr: 37683,
      followUp: { pr: 39742, author: "Yogesh-Shivaji365", merged: false },
      date: "2026-01-26",
    },
    {
      title: "Header bar colours and borders in digest emails",
      area: "emails",
      status: "co-authored",
      pr: 37289,
      followUp: { pr: 40177, author: "Code-Breaker-Ctrl", merged: false },
      date: "2026-01-02",
    },
    {
      title: "Bot avatar upload, delete and crop",
      area: "settings",
      status: "co-authored",
      pr: 38032,
      followUp: { pr: 40013, author: "Amormio25", merged: false },
      date: "2026-02-17",
    },
    {
      title: "Add emoji details when setting status in text emoji mode",
      area: "user_status",
      status: "open",
      pr: 37967,
      date: "2026-02-14",
    },
    {
      title: "Add a timestamp field to persist event times",
      area: "submessages",
      status: "open",
      pr: 37839,
      date: "2026-02-06",
    },
    {
      title: "Add padding for non-square emojis",
      area: "settings",
      status: "open",
      pr: 37571,
      date: "2026-01-19",
    },
    {
      title: "Improve message content styling in digest emails",
      area: "emails",
      status: "open",
      pr: 37283,
      date: "2026-01-01",
    },
    {
      title: "Allow cropping when uploading custom emojis",
      area: "settings",
      status: "closed",
      pr: 37231,
      date: "2025-12-27",
    },
  ] satisfies Contribution[],
};

export const openSourceStats = {
  merged: openSource.contributions.filter((c) => c.status === "merged").length,
  carried: openSource.contributions.filter(
    (c) => c.status === "co-authored" || c.status === "continued"
  ).length,
  open: openSource.contributions.filter((c) => c.status === "open").length,
};
