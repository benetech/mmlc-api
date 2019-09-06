#!/bin/bash

if [ $# -ne 2 ]
then
    echo "Usage: $0 host port"
    exit 1
fi

host=$1
port=$2

while ! nc -w 1 $host $port
do
    sleep 1
done
