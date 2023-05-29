cmd /C npm run build-docs
docker build -t sajadsalimzadeh/angular-components-docs:%1 .
docker push sajadsalimzadeh/angular-components-docs:%1
