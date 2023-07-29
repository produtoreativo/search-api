#!/bin/bash
[ ! -f .env ] || export $(grep -v '^#' .env | xargs)
npm run start:dev