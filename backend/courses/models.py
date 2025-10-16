from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone


class Course(models.Model):
    
    CATEGORY_CHOICES = [
        ('CS', 'Computer Science'),
        ('MATH', 'Mathematics'),
        ('PHYSICS', 'Physics'),
        ('OTHER', 'Other'),
    ]

    name = models.CharField( max_length=200,verbose_name="Course Name")
    instructor = models.CharField( max_length=150, verbose_name="Instructor Name")
    category = models.CharField(max_length=20,choices=CATEGORY_CHOICES,default='OTHER',verbose_name="Course Category")
    schedule = models.CharField(max_length=200,verbose_name="Course Schedule",blank=True,null=True)
    description = models.TextField(blank=True,null=True,verbose_name="Course Description")
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
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['category']),
            models.Index(fields=['instructor']),
        ]

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

    # student_id est un entier qui fait référence à un étudiant dans le Student Service
    # On ne peut pas utiliser ForeignKey car l'étudiant est dans un autre microservice
    student_id = models.IntegerField(verbose_name="Student ID")
    course = models.ForeignKey(Course,on_delete=models.CASCADE,related_name='enrollments',verbose_name="Course")
    enrollment_date = models.DateTimeField(default=timezone.now,verbose_name="Enrollment Date")
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='ENROLLED',verbose_name="Enrollment Status")
    
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

   