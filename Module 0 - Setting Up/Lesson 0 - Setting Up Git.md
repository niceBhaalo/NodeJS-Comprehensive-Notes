# Setting Up Git

Module 0 is about getting started. 

First thing is setting up a git project as a good habit. 
The steps are quite simple. 

1. Go to your project folder and type the command

`git init`

Assuming you have git installed, it creates a local git project in your current directory. 

2. Add some files to your local project using the git add command. 

`git add .`

This adds all the files in your folder. 

`git add filename`

This adds the specified file to your local project's staging area. 

3. Now the time is to commit the file from the staging area to your local repository.

`git commit -m "Commit Message"`

4. `git branch -M main`

This insures that you are using and setting up the main branch as the current and main branch. Could rename it to anything but main is standard, as well as master. 

5. (Optional) Now it is your choice whether you want to host your repository online somewhere or some backup you can set up locally.
Easiest way would be to create a github or gitlab account, create a repository in there. 
And then use their given link to connect your local repository to the remote one 
You would use 

`git remote add origin <remote repository link>`

And then use 

`git push -u origin main`

to link your main branch in the local repo to the main branch in the remote repo. 

You would need to set up authentication for your github or gitlab account. That is left up to you to figure out. 

6. After this, create a .gitignore file for safety's sake. And be mindful to put references to files and directories in this .gitignore file if you do not want them to be pushed to the remote repos. 

7. Lastly, we are going to be creating separate folders for the various lessons. 