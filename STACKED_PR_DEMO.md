# Stacked PR Demo

Use small documentation updates to practice reviewing a stack.

1. Create a first branch from your base branch and add a documentation change.
2. Commit the change and open a pull request against the base branch.
3. Create a second branch from the first branch and add another documentation change.
4. Commit the second change and open its pull request against the first branch.
5. Review each pull request to show how the second diff includes only its own changes.

Merge the first pull request before the second. Before merging the second, check
its target branch and diff again, updating them as needed after the first merge.
