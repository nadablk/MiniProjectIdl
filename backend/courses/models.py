from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


class Course(models.Model):
  
    CATEGORY_CHOICES = [
        ('CS', 'Computer Science'),
        ('MATH', 'Mathematics'),
        ('PHYSICS', 'Physics'),
        ('CHEMISTRY', 'Chemistry'),
        ('BIOLOGY', 'Biology'),
        ('ENGINEERING', 'Engineering'),
        ('BUSINESS', 'Business'),
        ('ARTS', 'Arts'),
        ('OTHER', 'Other'),
    ]

    name = models.CharField(
        max_length=200,
        verbose_name="Course Name"
    )
    
    instructor = models.CharField(
        max_length=150,
        verbose_name="Instructor Name",
        blank=True,
        null=True
    )
    
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='OTHER',
        verbose_name="Course Category"
    )
    
    schedule = models.CharField(
        max_length=200,
        verbose_name="Course Schedule",
        blank=True,
        null=True
    )
    
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name="Course Description"
    )
    
    credits = models.IntegerField(
        default=3,
        verbose_name="Credits",
        validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Updated At"
    )

    class Meta:
        db_table = 'courses'
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.instructor}"

    @property
    def enrolled_students_count(self):
       
        return self.studentcourse_set.count()


class StudentCourse(models.Model):
   
    STATUS_CHOICES = [
        ('ENROLLED', 'Enrolled'),
        ('COMPLETED', 'Completed'),
        ('DROPPED', 'Dropped'),
        ('FAILED', 'Failed'),
    ]

   
    student_id = models.IntegerField(
        verbose_name="Student ID",
        help_text="ID of the student from Student Service"
    )
    
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='enrollments',
        verbose_name="Course"
    )
    
    enrollment_date = models.DateTimeField(
        default=timezone.now,
        verbose_name="Enrollment Date"
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='ENROLLED',
        verbose_name="Enrollment Status"
    )
    
    grade = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(20)],
        verbose_name="Grade",
        help_text="Grade out of 20"
    )
    
    attendance_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name="Attendance Percentage"
    )
    
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="Additional Notes"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Created At"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Updated At"
    )

    class Meta:
        db_table = 'student_courses'
        verbose_name = 'Student Course Enrollment'
        verbose_name_plural = 'Student Course Enrollments'
        ordering = ['-enrollment_date']
        unique_together = ['student_id', 'course']  # Un étudiant ne peut s'inscrire qu'une fois au même cours
        indexes = [
            models.Index(fields=['student_id']),
            models.Index(fields=['course']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"Student {self.student_id} - {self.course.name} ({self.status})"

    @property
    def is_passing(self):
        """
        Vérifie si l'étudiant a la moyenne (>= 10/20)
        """
        if self.grade is None:
            return None
        return self.grade >= 10

    def complete_course(self, final_grade):
        """
        Méthode pour marquer le cours comme complété avec une note finale
        """
        self.grade = final_grade
        self.status = 'COMPLETED' if final_grade >= 10 else 'FAILED'
        self.save()

    def drop_course(self):
        """
        Méthode pour abandonner le cours
        """
        self.status = 'DROPPED'
        self.save()

# OLD Enrollment model - DISABLED (use StudentCourse instead)
# class Enrollment(models.Model):
# #     course = models.ForeignKey(Course, on_delete=models.CASCADE)
# #     student_id = models.IntegerField()  # Reference to student in other DB
#     enrolled_at = models.DateTimeField(auto_now_add=True)
class SharedTable(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    student_id = models.IntegerField(foreign_key=True)
    course_id = models.IntegerField()
    enrollment_date = models.DateTimeField()
    status = models.CharField(max_length=50)
    grade= models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    attendance_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = 'student_courses'  # exact table name from Spring
        managed = False  # Django will NOT run migrations for this table
