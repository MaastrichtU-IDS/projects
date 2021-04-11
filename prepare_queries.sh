# Concatenate files in the queries folder to assets/queries.rq
# sed -s '$a---' queries/*.rq | head -n -1 > assets/queries.rq

# find datasets/ -name '*.jsonld' | while read NAME ; do 
#     FOLDER=$(echo "${NAME}" | sed -r 's/([^\/]*)\/([^\/]*)\/(.*)$/\2/')
#     FILENAME=$(echo "${NAME}" | sed -r 's/([^\/]*)\/([^\/]*)\/(.*)$/\3/')
#     mkdir -p $FOLDER
# done

find ./datasets/ -name '*.jsonld' | while read NAME ; do 
    FOLDER=$(echo "${NAME}" | sed -r 's/\.\/([^\/]*)\/([^\/]*)\/(.*)$/\2/')
    FILENAME=$(echo "${NAME}" | sed -r 's/\.\/([^\/]*)\/([^\/]*)\/(.*)$/\3/')
    mkdir -p $FOLDER
    # python jsonld_to_html.py datasets/$FOLDER/$FILENAME $FOLDER/index.html
    cat datasets/$FOLDER/$FILENAME >> datasets_list.json
    echo "," >> datasets_list.json
done
echo "\n]" >> datasets_list.json