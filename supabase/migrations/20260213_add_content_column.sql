-- Add content column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS content TEXT;

-- Update the existing event with content
UPDATE events
SET content = '
# Workshop Overview
Join us for an comprehensive workshop on Git and GitHub, the industry-standard tools for version control and collaboration.

## What you will learn
- **Git Basics**: Understanding repositories, commits, branches, and merges.
- **GitHub Workflow**: Pull requests, issues, and code reviews.
- **Collaboration**: Resolving conflicts and working in teams.
- **Best Practices**: Writing good commit messages and maintaining a clean history.

## Prerequisites
- A laptop with Git installed.
- A GitHub account.
- Basic knowledge of command line interface (CLI) is helpful but not required.

## Schedule
- **10:00 AM**: Introduction to Version Control
- **11:00 AM**: Hands-on Git Commands
- **12:00 PM**: Lunch Break
- **1:00 PM**: GitHub Collaboration Workflow
- **2:00 PM**: Q&A and Networking
'
WHERE slug = 'git-github-workshop';
