#!/bin/bash
# Uploads css to s3 for 3rd parties to include them.

TAGNAME=

# validate s3put exists
which s3put 1>/dev/null
if [ "$?" -ne "0" ]; then
    echo  "You must install s3put via the boto python package."
    exit 1
fi

if [ "$AWS_ACCESS_KEY_ID" == "" ]; then
    echo "Please specify your AWS access key in the AWS_ACCESS_KEY_ID environment variable"
    exit 1;
fi

if [ "$AWS_ACCESS_KEY_SECRET" == "" ]; then
    echo "Please specify your AWS access key in the AWS_ACCESS_KEY_SECRET environment variable"
    exit 1;
fi

echo "Which tag do you want to upload assets for?"
read TAGNAME

# checkout git tag
if [ `git tag | grep $TAGNAME | wc -l` -eq "0" ]; then
    echo "You must specify an existing git tag."
    exit 1
fi

git checkout $TAGNAME

# build css
gulp cssmin || exit 1

# upload css to s3 in a tagged folder.
s3put --access_key $AWS_ACCESS_KEY_ID --secret_key $AWS_ACCESS_KEY_SECRET --bucket sprintly-ui-build-artifacts --prefix $PWD/dist/css/ --key_prefix $TAGNAME dist/css
