#!/usr/bin/env bash

set -eo pipefail

SCENARIO="${1:-Book:setup}"

# Change to the daml subfolder
cd $(dirname "${BASH_SOURCE[0]}")
cd daml

# Launch the sandbox
daml sandbox --ledgerid DRML --scenario "$SCENARIO" .daml/dist/drml-0.0.1.dar
