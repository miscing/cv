# Cv

A personal cv generator. Generates a cv based on github repository topics, so your cv will always reflect your current code. If you decide to use this CV maker please LEAVE THE LINK TO THIS REPOSITORY. [Uses githubs octokit javascript client.](https://github.com/octokit/rest.js)

## Cool features:
 - Select the parts you want to keep, then print as PDF. Keep all your CV versions in one place, customize for each job application.
 - Have your CV include all your newest github repositories.
 - Use YAML to easily configure.
 - You can store settings by removing cv.yml and using the generated cv.json (button JSON at right panel of website)

## To use:
1. Fork or otherwise copy this repository. (you may want to delete/rename `cv.json` and/or `cv.yml`)
2. Configure with one of the two methods:
   1. (Under development) Use GUI in website and copy generated JSON to `cv.json`.
   2. Configure using YAML in cv.yml file, then run pipeline.
3. (Optional) Store settings by copying generated JSON to cv.json and deleting cv.yml.
4. Skills are generated based on repository topics, so make sure your Github repos have relevant topics (more specifically make sure the skill name is in in the relevant repos topics).

## Example:
Here is my own CV, be nice (But feedback is highly encouraged, whether about content or underlying code)!
[Always looking for a good job :)](https://miscing.github.io/cv/)

## Additional Features:
Some features like LinkedIn, Facebook, etc. logos are missing but simple to implement. If you ask for such features (create an issue) I will be happy to add them should someone want them. 

## Yaml syntax

### Top level:
Top level items are used to construct the profile. On top of the reserved keywords in the table below, all the following sections have their own keyword, keywords are same as section title.

| Keyword    | Input syntax              | Explanation                                                                                                       |
|------------|---------------------------|-------------------------------------------------------------------------------------------------------------------|
| name       | Firstname Surname         | Name to display, only accepts two words. Required.                                                                |
| gitlab     | username                  | Gitlab username                                                                                                   |
| github     | username                  | Github username                                                                                                   |
| matrix     | username                  | Matrix username                                                                                                   |

#### About:
An array of strings allowing one to put multiple 'about me' texts as well as defining some basic information with keywords. You can place the text on the same line if you only have one item.
```yaml
about:
  - "This is a elaborate and embellished explanation of who I am and what I have done."
  - "This is a modified version of the above meant for a different job."
```

| Keyword    | Input syntax              | Explanation                                                                                                       |
|------------|---------------------------|-------------------------------------------------------------------------------------------------------------------|
| language   | a language and number     | Language proficiency: Limited working proficiency, working proficiency and native, 1-3 respectively (3 is native).|
| custom     | string                    | A string containing a free form text describing you, all items that are strings will be interpreted as this.      |

#### Timeline:
Create a timeline of work experience and formal education. You can omit the end date (or use 'present') to make it the end date: 'Present'. Accepts date but final result has an accuracy of month/year so it will be omitted.
```yaml
timeline:
  - 12/2020-: "Trying to survive"
  - 01/2001-12/2020: "Living la vida loca"
```

| Keyword    | Input syntax                             | Explanation                                                                                                       |
|------------|------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| custom     | month/year-month/year: "free-form text"  | give starting date and ending date of a life experience. Empty ending date will show up as 'Present'              |

#### Skills:
Default behavior is to create the skill with links to all github repositories that contain the skill name as a github "Topic". If the skill has children, they are assumed to be topic names to match with (multiple topics to match with can be assigned like this, skill name is ignored in this case), with the exception of reserved keywords below.
```yaml
skills:
  - c:
    - file:
      - filename
```

| Keyword    | Input syntax              | Explanation                                                                                                       |
|------------|---------------------------|-------------------------------------------------------------------------------------------------------------------|
| text       | long string escape with ""| A short explanation of skill.                                                                                     |
| file       | file name to use, see ->  | On top of showing links to matching topics, will also have direct links to files with provided filename.          |
| rfile      | file name to use, regex   | Same as file, except string is interpreted as regex. Notice "." in regex is a special character.                  |
| url        | list of valid url         | This urls will be show in addition (or alone) to repositories, in the same way                                    |
| level      | number 1-5, 5 is best     | Meant to be a general indication of proficiency in the given skill.                                               |
| custom     | string, skill name        | Name of topic or topics to match with, overrides matching with parent skill name.                                 |

### Example Yaml:
```yaml
name: John Doe
github: johnnydoe

about: "While my name is a reference to 'nobody', I assure you that I myself am incredibly irremarkable. I first entered existance on Decemeber 2020, when there came a need for a example person to use to showcase the features of a CV generation website. I have done little else in that capacity, but you will find that I am referenced everywhere in the world. You could say I am the greatest 'personal information' model in the world."

skills:
  - javascript
  - c
  - kotlin
```


## Other Information:
If you decide to use this CV maker please LEAVE THE LINK TO THIS REPOSITORY.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.7.
