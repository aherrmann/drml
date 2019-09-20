#!/usr/bin/env bash

set -eo pipefail

# This will install both run-time project dependencies and developer tools listed in package.json.
./install.sh

# Change to the daml subfolder
cd $(dirname "${BASH_SOURCE[0]}")
cd daml

# Build the daml models
daml build

# Launch the sandbox
daml sandbox --ledgerid DRML --scenario Book:setup .daml/dist/drml-0.0.1.dar
