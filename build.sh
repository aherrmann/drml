#!/usr/bin/env bash

set -eo pipefail

# Change to the project base directory
cd $(dirname "${BASH_SOURCE[0]}")

# This will install both run-time project dependencies and developer tools listed in package.json.
yarn install

# Change to the daml subfolder
cd $(dirname "${BASH_SOURCE[0]}")
cd daml

# Build the daml models
daml build
