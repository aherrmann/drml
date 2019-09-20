#!/usr/bin/env bash

set -eo pipefail

# Change to the daml subfolder
cd $(dirname "${BASH_SOURCE[0]}")
cd daml

# Launch the navigator
daml navigator server

