#!/usr/bin/env bash

set -eo pipefail

cd $(dirname "${BASH_SOURCE[0]}")

./1_sandbox_start.sh Book:demoBeforeBankrupt
