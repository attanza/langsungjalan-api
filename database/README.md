## Entity Relationship Diagram

ERD is a diagram that shows database tables and the relationships between them.
In this project, the ERD is defined as a plain text using PlantUML format.

### Compiling ERD

To be able to compile the PlantUML definition files to PNG, you need to have:

- Java,
- GraphViz visualization software, and
- PlantUML diagramming tool (at least version V8054).

In Ubuntu Linux, Java is usually available by default. GraphViz can be
installed from the package manager.

```shell
$ sudo apt-get install graphviz
```

PlantUML is a JAR file that can be download from http://plantuml.com/download.
Save it in this directory, then run the following command:

```shell
$ java -jar plantuml.jar erd.plantuml
```

The result can be found in the same directory under the name `erd.png`.
