import { faker } from '@faker-js/faker';

export interface FakerConfig {
  seed?: number;
  locale?: string;
}

export class FakerUtils {
  private static instance: FakerUtils;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): FakerUtils {
    if (!FakerUtils.instance) {
      FakerUtils.instance = new FakerUtils();
    }
    return FakerUtils.instance;
  }

  initialize(config: FakerConfig = {}): void {
    if (this.isInitialized) return;

    const { seed } = config;
    
    if (seed) {
      faker.seed(seed);
    }
    
    this.isInitialized = true;
  }

  // User-related fakers
  user() {
    return {
      email: faker.internet.email(),
      fullName: faker.person.fullName(),
      avatarUrl: faker.image.avatar(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      username: faker.internet.username(),
      bio: faker.lorem.sentence(),
      location: faker.location.city(),
      website: faker.internet.url(),
      phone: faker.phone.number(),
      birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' })
    };
  }

  // Post-related fakers
  post() {
    return {
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      content: faker.lorem.paragraphs({ min: 1, max: 5 }),
      excerpt: faker.lorem.sentence({ min: 10, max: 20 }),
      tags: faker.helpers.arrayElements([
        'tecnologia', 'programação', 'design', 'marketing', 'negócios',
        'startup', 'inovação', 'produtividade', 'carreira', 'educação'
      ], { min: 1, max: 4 }),
      category: faker.helpers.arrayElement([
        'artigo', 'tutorial', 'opinião', 'notícia', 'review'
      ])
    };
  }

  // Company-related fakers
  company() {
    return {
      name: faker.company.name(),
      catchPhrase: faker.company.catchPhrase(),
      bs: faker.company.buzzPhrase(),
      industry: faker.company.buzzNoun(),
      foundedYear: faker.number.int({ min: 1990, max: 2024 }),
      employeeCount: faker.number.int({ min: 1, max: 1000 })
    };
  }

  // Address-related fakers
  address() {
    return {
      street: faker.location.street(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
      zipCode: faker.location.zipCode(),
      coordinates: {
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude()
      }
    };
  }

  // Date utilities
  date() {
    return {
      recent: (days = 7) => faker.date.recent({ days }),
      soon: (days = 7) => faker.date.soon({ days }),
      past: (years = 1) => faker.date.past({ years }),
      future: (years = 1) => faker.date.future({ years }),
      between: (from: Date, to: Date) => faker.date.between({ from, to })
    };
  }

  // Array utilities
  array<T>(generator: () => T, count: number): T[] {
    return Array.from({ length: count }, generator);
  }

  // Random utilities
  random() {
    return {
      boolean: () => faker.datatype.boolean(),
      number: (min = 1, max = 100) => faker.number.int({ min, max }),
      float: (min = 0, max = 1) => faker.number.float({ min, max }),
      element: <T>(array: T[]) => faker.helpers.arrayElement(array),
      elements: <T>(array: T[], count?: number) => faker.helpers.arrayElements(array, count),
      uuid: () => faker.string.uuid(),
      hex: () => faker.string.hexadecimal(),
      alpha: (length = 10) => faker.string.alpha({ length }),
      numeric: (length = 10) => faker.string.numeric({ length }),
      alphanumeric: (length = 10) => faker.string.alphanumeric({ length })
    };
  }

  // Image utilities
  image() {
    return {
      avatar: () => faker.image.avatar(),
      url: (width = 640, height = 480) => faker.image.url({ width, height }),
      urlPlaceholder: (width = 640, height = 480) => faker.image.url({ width, height })
    };
  }

  // Lorem utilities
  lorem() {
    return {
      word: () => faker.lorem.word(),
      words: (count = 3) => faker.lorem.words({ min: count, max: count }),
      sentence: (min = 5, max = 15) => faker.lorem.sentence({ min, max }),
      sentences: (count = 3) => faker.lorem.sentences({ min: count, max: count }),
      paragraph: (min = 3, max = 7) => faker.lorem.paragraph({ min, max }),
      paragraphs: (count = 3) => faker.lorem.paragraphs({ min: count, max: count }),
      text: () => faker.lorem.text(),
      lines: (count = 3) => faker.lorem.lines({ min: count, max: count })
    };
  }
}

// Export singleton instance
export const fakerUtils = FakerUtils.getInstance();
