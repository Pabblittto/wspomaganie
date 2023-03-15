#!/bin/sh
# script for adding ssh key to ssh agent in order to be able to send commint to repo

cd ~
cd .ssh/
ssh-add -k id_rsa
exit