#!/bin/bash

# ==============================================================================
# Git Sync Script - Interactive Staging, Committing, and Pushing
# ==============================================================================

# Define clean color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Helper functions for UI styling
print_step() {
    echo -e "\n${BLUE}${BOLD}==>${NC} ${BOLD}$1${NC}"
}

print_success() {
    echo -e "${GREEN}${BOLD}✔${NC} ${GREEN}$1${NC}"
}

print_error() {
    echo -e "${RED}${BOLD}✘ Error:${NC} ${RED}$1${NC}"
}

print_warn() {
    echo -e "${YELLOW}${BOLD}⚠ Warning:${NC} ${YELLOW}$1${NC}"
}

# 1. Verify that the current directory is a Git repository
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    print_error "The current directory is not a Git repository."
    exit 1
fi

CURRENT_BRANCH=$(git symbolic-ref --short HEAD 2>/dev/null)
if [ -z "$CURRENT_BRANCH" ]; then
    CURRENT_BRANCH=$(git rev-parse --short HEAD 2>/dev/null)
    print_warn "You are in a detached HEAD state ($CURRENT_BRANCH)."
else
    print_success "Active Git Repository detected on branch: ${CYAN}${BOLD}${CURRENT_BRANCH}${NC}"
fi

# 2. Check for changes
git status --porcelain | grep -q .
if [ $? -ne 0 ]; then
    print_success "No uncommitted changes detected. Working tree is clean."
    exit 0
fi

# 3. Present status
print_step "Current Repository Status"
git status -s

# 4. Interactive Staging Choices
print_step "Staging Changes"
echo -e "Select staging option:"
echo -e "  [${CYAN}1${NC}] Stage all changes (both modified & untracked files) -> 'git add .'"
echo -e "  [${CYAN}2${NC}] Stage modified files only (ignore untracked) -> 'git add -u'"
echo -e "  [${CYAN}3${NC}] Interactive staging -> 'git add -i'"
echo -e "  [${CYAN}4${NC}] Skip staging (use currently staged files)"
echo -ne "Choose option (1-4, Default: 1): "
read -r stage_choice

case "$stage_choice" in
    2)
        git add -u
        print_success "Staged modified files only."
        ;;
    3)
        git add -i
        ;;
    4)
        print_success "Skipped staging. Committing currently staged changes."
        ;;
    *)
        git add .
        print_success "Staged all changes."
        ;;
esac

# Check if anything is staged for commit
if ! git diff --cached --quiet; then
    staged_status=true
else
    staged_status=false
fi

if [ "$staged_status" = false ]; then
    print_error "No changes are staged for commit. Please stage files first."
    exit 1
fi

# 5. Prompt for Commit Message
print_step "Creating Commit"
while true; do
    echo -e "Enter commit message (Type and press Enter):"
    echo -ne "${CYAN}> ${NC}"
    read -r commit_message
    
    if [ -n "$commit_message" ]; then
        break
    else
        print_warn "Commit message cannot be empty. Please enter a valid message."
    fi
done

# Perform Commit
if git commit -m "$commit_message"; then
    print_success "Committed changes successfully."
else
    print_error "Failed to create commit."
    exit 1
fi

# 6. Push to remote
print_step "Pushing to Remote"
echo -ne "Do you want to push to remote? (y/n, Default: y): "
read -r push_choice

if [[ "$push_choice" =~ ^[Nn]$ ]]; then
    print_success "Commit finished. Pushing skipped."
    exit 0
fi

# Detect remote
REMOTE=$(git config --get branch."$CURRENT_BRANCH".remote)
if [ -z "$REMOTE" ]; then
    # Fallback to origin
    REMOTE="origin"
fi

print_step "Pushing to ${REMOTE}/${CURRENT_BRANCH}..."
if git push "$REMOTE" "$CURRENT_BRANCH"; then
    print_success "Pushed to ${REMOTE}/${CURRENT_BRANCH} successfully!"
else
    print_error "Push failed. You might need to set upstream: 'git push --set-upstream $REMOTE $CURRENT_BRANCH'."
    exit 1
fi
