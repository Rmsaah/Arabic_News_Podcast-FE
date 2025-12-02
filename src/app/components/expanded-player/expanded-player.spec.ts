import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpandedPlayer } from './expanded-player';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EpisodeDto } from '../../models/episode.model';

describe('ExpandedPlayer', () => {
  let component: ExpandedPlayer;
  let fixture: ComponentFixture<ExpandedPlayer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandedPlayer],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExpandedPlayer);
    component = fixture.componentInstance;

    // Set required inputs BEFORE detectChanges
    component.episode = {
      id: 'test-id',
      title: 'Test Episode Title',
      imageUrl: 'https://example.com/test-image.jpg',
      audioUrl: 'https://example.com/test-audio.mp3',
      audioUrlPath: 'https://example.com/test-audio.mp3',
      articleAuthor: 'Test Author',
      averageRating: 4.5,
      ratingCount: 100,
      description: 'Test description',
      scriptUrlPath: 'https://example.com/script',
      durationSeconds: 300,
      category: 'Test Category',
      publishedDate: '2025-12-02',
      creationDate: '2025-12-02',
      articleId: 'test-article-id',
      articleTitle: 'Test Article Title',
      articleSubtitle: 'Test Article Subtitle',
      articlePublisher: 'Test Publisher',
      articleCategory: 'Test Article Category'
    } as EpisodeDto;

    component.currentPosition = 0;
    component.formattedPosition = '0:00';
    component.formattedDuration = '5:00';
    component.isPlaying = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
