#!/bin/sh
# script for removing ssh key from ssh agent in order to not block touchbistro work

cd ~
cd .ssh/
ssh-add -D id_rsa
ssh-add -k id_tb_rsa
exit