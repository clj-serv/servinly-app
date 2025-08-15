# Deployment Audit Report

Generated: Sat Aug 16 2025 06:53:30 GMT+1000 (Australian Eastern Standard Time)

## Git
- Current branch: `feature/ai-integration-restore`
- Remotes:
```
origin	https://github.com/clj-serv/servinly-app.git (fetch)
origin	https://github.com/clj-serv/servinly-app.git (push)
```
- Branches:
```
ERROR: Command failed: git branch -a --verbose --no-abbrev --decorate
error: unknown option `decorate'
usage: git branch [<options>] [-r | -a] [--merged] [--no-merged]
   or: git branch [<options>] [-f] [--recurse-submodules] <branch-name> [<start-point>]
   or: git branch [<options>] [-l] [<pattern>...]
   or: git branch [<options>] [-r] (-d | -D) <branch-name>...
   or: git branch [<options>] (-m | -M) [<old-branch>] <new-branch>
   or: git branch [<options>] (-c | -C) [<old-branch>] <new-branch>
   or: git branch [<options>] [-r | -a] [--points-at]
   or: git branch [<options>] [-r | -a] [--format]

Generic options
    -v, --verbose         show hash and subject, give twice for upstream branch
    -q, --quiet           suppress informational messages
    -t, --track[=(direct|inherit)]
                          set branch tracking configuration
    -u, --set-upstream-to <upstream>
                          change the upstream info
    --unset-upstream      unset the upstream info
    --color[=<when>]      use colored output
    -r, --remotes         act on remote-tracking branches
    --contains <commit>   print only branches that contain the commit
    --no-contains <commit>
                          print only branches that don't contain the commit
    --abbrev[=<n>]        use <n> digits to display object names

Specific git-branch actions:
    -a, --all             list both remote-tracking and local branches
    -d, --delete          delete fully merged branch
    -D                    delete branch (even if not merged)
    -m, --move            move/rename a branch and its reflog
    -M                    move/rename a branch, even if target exists
    -c, --copy            copy a branch and its reflog
    -C                    copy a branch, even if target exists
    -l, --list            list branch names
    --show-current        show current branch name
    --create-reflog       create the branch's reflog
    --edit-description    edit the description for the branch
    -f, --force           force creation, move/rename, deletion
    --merged <commit>     print only branches that are merged
    --no-merged <commit>  print only branches that are not merged
    --column[=<style>]    list branches in columns
    --sort <key>          field name to sort on
    --points-at <object>  print only branches of the object
    -i, --ignore-case     sorting and filtering are case insensitive
    --recurse-submodules  recurse through submodules
    --format <format>     format to use for the output


```
## CI (GitHub Actions)
- Workflows:
```
test.yml
```
## Vercel
- vercel.json present: yes
- VERCEL_TOKEN: missing
- Project list (best-effort):
```

```
- Env list (best-effort):
```
ERROR: Command failed: npx -y vercel env ls --token "$VERCEL_TOKEN" 2>/dev/null
```
## Supabase
- supabase/ dir present: yes
- supabase/config.toml present: no
- SUPABASE_ACCESS_TOKEN: missing
- Projects (best-effort):
```
LINKED | ORG ID               | REFERENCE ID         | NAME             | REGION           | CREATED AT (UTC)    
  --------|----------------------|----------------------|------------------|------------------|---------------------
     ●    | ilzfoqkyfacddvgtfwvp | fpcyvhbjpwtubwbkrwde | servinly         | Oceania (Sydney) | 2025-08-05 03:18:58 
          | ilzfoqkyfacddvgtfwvp | fckxfgdlqywenkjztbok | servinly-staging | Oceania (Sydney) | 2025-08-08 03:51:39
```
## Local Env Keys (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://placeholder-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUwNjg0MDAsImV4cCI6MTk2MDY0NDQwMH0.placeholder-key
SUPABASE_SERVICE_ROLE_KEY=placeholder-service-key
NEXT_PUBLIC_ONB_SUPABASE_SAVE=false
```
## Template Env Keys (.env.example)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
NEXT_PUBLIC_ONB_SUPABASE_SAVE=false
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_SUPABASE_URL=https://<your-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
```
## Observations
- Expect one Git branch per deploy lane: `staging` → servinly-staging (Preview), `main` → servinly (Prod).
- Verify CI triggers and Vercel mappings align with that workflow before making changes.
