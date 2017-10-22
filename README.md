# webpack-wordpress-theme

This is a base template to add custom styles and js to an existing wordpress theme.

### Installation
First you need to clone this repo inside the **theme folder** inside a folder that I usually call `__dev__`. If you have your theme in a repo remember to add `__dev__/node_modules` to **.gitignore** file.
Then `cd __dev__ && yarn` to install all the packages.

Now you have to add this line before the `head` closing tag to load you custom js and css.
```
<script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/js/bundle.js"></script>
<link type='text/css' media='all' rel='stylesheet'  href='<?php echo get_template_directory_uri(); ?>/css/main.css' />
```

At this point you can edit `.env` file with the **HOST** and **PORT** of the `webpack-dev-server` and the **WP_HOST** and **WP_PORT**
to tell `webpack-dev-server` where to proxy to wordpress.

#### Development mode

```
npm run dev
```
To open the dev dashboard

```
npm run dev:dash
```
To open the bundle analyzer

```
npm run dev:analyzer
```

#### Build for production

```
npm run build
```