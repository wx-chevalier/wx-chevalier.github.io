
---
title: Builder
linktitle: Builder
type: book
commentable: true
---

# Builder

源代码：

```java
import java.util.Set;
import lombok.experimental.Builder;

@Builder
public class BuilderExample {
  private String name;
  private int age;
  private Set<String> occupations;

  public static void main(String args[]) {
    BuilderExample builderExample = BuilderExample.builder().build();
  }
}
```

编译之后的源代码：

```java
import java.util.Set;

public class BuilderExample {
	private String name;
	private int age;
	private Set<String> occupations;

	BuilderExample(String name, int age, Set<String> occupations) {
		this.name = name;
		this.age = age;
		this.occupations = occupations;
}

	public static BuilderExampleBuilder builder() {
		return new BuilderExampleBuilder();
	}

	public static class BuilderExampleBuilder {
		private String name;
		private int age;
		private java.util.ArrayList<String> occupations;

		BuilderExampleBuilder() {
		}

		public BuilderExampleBuilder name(String name) {
			this.name = name;
			return this;
		}

		public BuilderExampleBuilder age(int age) {
			this.age = age;
			return this;
		}

		public BuilderExampleBuilder occupation(String occupation) {
			if (this.occupations == null) {
				this.occupations = new java.util.ArrayList<String>();
			}

			this.occupations.add(occupation);
			return this;
		}

		public BuilderExampleBuilder occupations(Collection<? extends String> occupations) {
			if (this.occupations == null) {
				this.occupations = new java.util.ArrayList<String>();
			}

			this.occupations.addAll(occupations);
			return this;
		}

		public BuilderExampleBuilder clearOccupations() {
			if (this.occupations != null) {
				this.occupations.clear();
			}

			return this;
		}

		public BuilderExample build() {
			// complicated switch statement to produce a compact properly sized immutable set omitted.
			// go to https://projectlombok.org/features/Singular-snippet.html to see it.
			Set<String> occupations = ...;
			return new BuilderExample(name, age, occupations);
		}

		@java.lang.Override
		public String toString() {
			return "BuilderExample.BuilderExampleBuilder(name = " + this.name + ", age = " + this.age + ", occupations = " + this.occupations + ")";
		}
	}
}
```

# 设置建造者模式的必要参数

```java
import lombok.Builder;
import lombok.ToString;

@Builder(builderMethodName = "hiddenBuilder")
@ToString
public class Person {
  private String name;
  private String surname;

  public static PersonBuilder builder(String name) {
    return hiddenBuilder().name(name);
  }
}
```

    