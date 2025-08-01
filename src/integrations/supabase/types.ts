export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          attachments: string[] | null
          content: string
          created_at: string | null
          created_by: string
          expire_date: string | null
          id: string
          is_published: boolean | null
          priority: string | null
          publish_date: string | null
          target_audience: string[]
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          attachments?: string[] | null
          content: string
          created_at?: string | null
          created_by: string
          expire_date?: string | null
          id?: string
          is_published?: boolean | null
          priority?: string | null
          publish_date?: string | null
          target_audience: string[]
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          attachments?: string[] | null
          content?: string
          created_at?: string | null
          created_by?: string
          expire_date?: string | null
          id?: string
          is_published?: boolean | null
          priority?: string | null
          publish_date?: string | null
          target_audience?: string[]
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_announcements_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_requests: {
        Row: {
          created_at: string | null
          id: string
          justification: string | null
          rejection_reason: string | null
          request_data: Json
          request_type: string
          requested_role: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          justification?: string | null
          rejection_reason?: string | null
          request_data: Json
          request_type: string
          requested_role?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          justification?: string | null
          rejection_reason?: string | null
          request_data?: Json
          request_type?: string
          requested_role?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_approval_requests_reviewed_by"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          check_in_time: string | null
          check_out_time: string | null
          class_id: string
          created_at: string | null
          date: string
          id: string
          marked_by: string
          remarks: string | null
          status: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          check_in_time?: string | null
          check_out_time?: string | null
          class_id: string
          created_at?: string | null
          date: string
          id?: string
          marked_by: string
          remarks?: string | null
          status: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          class_id?: string
          created_at?: string | null
          date?: string
          id?: string
          marked_by?: string
          remarks?: string | null
          status?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_attendance_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_attendance_marked_by"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_attendance_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      author_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          post_count: number | null
          social_links: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          id?: string
          post_count?: number | null
          social_links?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          post_count?: number | null
          social_links?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_approved: boolean | null
          parent_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          parent_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean | null
          parent_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_tags: {
        Row: {
          id: string
          post_id: string
          tag_id: string
        }
        Insert: {
          id?: string
          post_id: string
          tag_id: string
        }
        Update: {
          id?: string
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          category_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean | null
          published_at: string | null
          reading_time: number | null
          slug: string
          status: string
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id: string
          category_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      class_subjects: {
        Row: {
          class_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          periods_per_week: number | null
          subject_id: string
          teacher_id: string
        }
        Insert: {
          class_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          periods_per_week?: number | null
          subject_id: string
          teacher_id: string
        }
        Update: {
          class_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          periods_per_week?: number | null
          subject_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_class_subjects_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_class_subjects_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_class_subjects_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          academic_year: string
          capacity: number | null
          class_teacher_id: string | null
          code: string
          created_at: string | null
          grade_level: number
          id: string
          is_active: boolean | null
          name: string
          section: string | null
          updated_at: string | null
        }
        Insert: {
          academic_year: string
          capacity?: number | null
          class_teacher_id?: string | null
          code: string
          created_at?: string | null
          grade_level: number
          id?: string
          is_active?: boolean | null
          name: string
          section?: string | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: string
          capacity?: number | null
          class_teacher_id?: string | null
          code?: string
          created_at?: string | null
          grade_level?: number
          id?: string
          is_active?: boolean | null
          name?: string
          section?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_classes_teacher"
            columns: ["class_teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_schedules: {
        Row: {
          class_id: string
          created_at: string | null
          duration: number
          end_time: string
          exam_date: string
          examination_id: string
          id: string
          invigilator_id: string | null
          max_marks: number
          room_number: string | null
          start_time: string
          subject_id: string
          updated_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          duration: number
          end_time: string
          exam_date: string
          examination_id: string
          id?: string
          invigilator_id?: string | null
          max_marks: number
          room_number?: string | null
          start_time: string
          subject_id: string
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          duration?: number
          end_time?: string
          exam_date?: string
          examination_id?: string
          id?: string
          invigilator_id?: string | null
          max_marks?: number
          room_number?: string | null
          start_time?: string
          subject_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_exam_schedules_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_exam_schedules_examination"
            columns: ["examination_id"]
            isOneToOne: false
            referencedRelation: "examinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_exam_schedules_invigilator"
            columns: ["invigilator_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_exam_schedules_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      examinations: {
        Row: {
          academic_year: string
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          name: string
          start_date: string
          type: string
          updated_at: string | null
        }
        Insert: {
          academic_year: string
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          name: string
          start_date: string
          type: string
          updated_at?: string | null
        }
        Update: {
          academic_year?: string
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          start_date?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      fee_payments: {
        Row: {
          amount_paid: number
          collected_by: string
          created_at: string | null
          discount: number | null
          fee_structure_id: string
          id: string
          late_fee: number | null
          payment_date: string
          payment_method: string
          receipt_number: string
          remarks: string | null
          student_id: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount_paid: number
          collected_by: string
          created_at?: string | null
          discount?: number | null
          fee_structure_id: string
          id?: string
          late_fee?: number | null
          payment_date: string
          payment_method: string
          receipt_number: string
          remarks?: string | null
          student_id: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number
          collected_by?: string
          created_at?: string | null
          discount?: number | null
          fee_structure_id?: string
          id?: string
          late_fee?: number | null
          payment_date?: string
          payment_method?: string
          receipt_number?: string
          remarks?: string | null
          student_id?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_fee_payments_collected_by"
            columns: ["collected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_fee_payments_fee_structure"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_fee_payments_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_structures: {
        Row: {
          academic_year: string
          class_id: string
          created_at: string | null
          due_date: string
          id: string
          is_active: boolean | null
          lab_fee: number | null
          late_fee_rate: number | null
          library_fee: number | null
          name: string
          other_fees: Json | null
          sports_fee: number | null
          total_amount: number
          transport_fee: number | null
          tuition_fee: number | null
          updated_at: string | null
        }
        Insert: {
          academic_year: string
          class_id: string
          created_at?: string | null
          due_date: string
          id?: string
          is_active?: boolean | null
          lab_fee?: number | null
          late_fee_rate?: number | null
          library_fee?: number | null
          name: string
          other_fees?: Json | null
          sports_fee?: number | null
          total_amount: number
          transport_fee?: number | null
          tuition_fee?: number | null
          updated_at?: string | null
        }
        Update: {
          academic_year?: string
          class_id?: string
          created_at?: string | null
          due_date?: string
          id?: string
          is_active?: boolean | null
          lab_fee?: number | null
          late_fee_rate?: number | null
          library_fee?: number | null
          name?: string
          other_fees?: Json | null
          sports_fee?: number | null
          total_amount?: number
          transport_fee?: number | null
          tuition_fee?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_fee_structures_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_items: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          event_date: string | null
          id: string
          image_url: string
          is_featured: boolean | null
          is_published: boolean | null
          title: string
          updated_at: string | null
          uploaded_by: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          image_url: string
          is_featured?: boolean | null
          is_published?: boolean | null
          title: string
          updated_at?: string | null
          uploaded_by: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          id?: string
          image_url?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_gallery_items_uploaded_by"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_applications: {
        Row: {
          applicant_id: string
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          days_count: number
          end_date: string
          id: string
          leave_type: string
          reason: string
          rejection_reason: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          applicant_id: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          days_count: number
          end_date: string
          id?: string
          leave_type: string
          reason: string
          rejection_reason?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          days_count?: number
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string
          rejection_reason?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_leave_applications_applicant"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_leave_applications_approved_by"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marks: {
        Row: {
          created_at: string | null
          entered_by: string
          exam_schedule_id: string
          grade: string | null
          id: string
          marks_obtained: number
          max_marks: number
          remarks: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          entered_by: string
          exam_schedule_id: string
          grade?: string | null
          id?: string
          marks_obtained: number
          max_marks: number
          remarks?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          entered_by?: string
          exam_schedule_id?: string
          grade?: string | null
          id?: string
          marks_obtained?: number
          max_marks?: number
          remarks?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_marks_entered_by"
            columns: ["entered_by"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_marks_exam_schedule"
            columns: ["exam_schedule_id"]
            isOneToOne: false
            referencedRelation: "exam_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_marks_student"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: string[] | null
          content: string
          created_at: string | null
          id: string
          is_important: boolean | null
          is_read: boolean | null
          recipient_id: string
          reply_to: string | null
          sender_id: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          attachments?: string[] | null
          content: string
          created_at?: string | null
          id?: string
          is_important?: boolean | null
          is_read?: boolean | null
          recipient_id: string
          reply_to?: string | null
          sender_id: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          attachments?: string[] | null
          content?: string
          created_at?: string | null
          id?: string
          is_important?: boolean | null
          is_read?: boolean | null
          recipient_id?: string
          reply_to?: string | null
          sender_id?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_messages_recipient"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_messages_reply_to"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_messages_sender"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          full_name: string
          gender: string | null
          id: string
          is_active: boolean | null
          permissions: string[] | null
          phone: string | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          full_name: string
          gender?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: string[] | null
          phone?: string | null
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          full_name?: string
          gender?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: string[] | null
          phone?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          academic_year_end: string | null
          academic_year_start: string | null
          address: string | null
          code: string
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          phone: string | null
          settings: Json | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          academic_year_end?: string | null
          academic_year_start?: string | null
          address?: string | null
          code: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          phone?: string | null
          settings?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          academic_year_end?: string | null
          academic_year_start?: string | null
          address?: string | null
          code?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          settings?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      staff_attendance: {
        Row: {
          check_in_time: string | null
          check_out_time: string | null
          created_at: string | null
          date: string
          id: string
          marked_by: string | null
          remarks: string | null
          status: string
          teacher_id: string
          updated_at: string | null
          working_hours: number | null
        }
        Insert: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          date: string
          id?: string
          marked_by?: string | null
          remarks?: string | null
          status: string
          teacher_id: string
          updated_at?: string | null
          working_hours?: number | null
        }
        Update: {
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string | null
          date?: string
          id?: string
          marked_by?: string | null
          remarks?: string | null
          status?: string
          teacher_id?: string
          updated_at?: string | null
          working_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_staff_attendance_marked_by"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_staff_attendance_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          admission_date: string
          admission_number: string
          class_id: string
          created_at: string | null
          emergency_contact: string | null
          fee_concession: number | null
          id: string
          medical_info: string | null
          parent_email: string | null
          parent_name: string | null
          parent_phone: string | null
          roll_number: string | null
          status: string | null
          student_id: string
          transport_info: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admission_date: string
          admission_number: string
          class_id: string
          created_at?: string | null
          emergency_contact?: string | null
          fee_concession?: number | null
          id?: string
          medical_info?: string | null
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          roll_number?: string | null
          status?: string | null
          student_id: string
          transport_info?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admission_date?: string
          admission_number?: string
          class_id?: string
          created_at?: string | null
          emergency_contact?: string | null
          fee_concession?: number | null
          id?: string
          medical_info?: string | null
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          roll_number?: string | null
          status?: string | null
          student_id?: string
          transport_info?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_students_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string
          created_at: string | null
          credit_hours: number | null
          description: string | null
          id: string
          is_active: boolean | null
          is_mandatory: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          credit_hours?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_mandatory?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          credit_hours?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_mandatory?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          bank_account: string | null
          created_at: string | null
          department: string | null
          emergency_contact: string | null
          employee_id: string
          experience_years: number | null
          id: string
          is_class_teacher: boolean | null
          joining_date: string
          qualification: string | null
          salary: number | null
          status: string | null
          subjects: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bank_account?: string | null
          created_at?: string | null
          department?: string | null
          emergency_contact?: string | null
          employee_id: string
          experience_years?: number | null
          id?: string
          is_class_teacher?: boolean | null
          joining_date: string
          qualification?: string | null
          salary?: number | null
          status?: string | null
          subjects?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bank_account?: string | null
          created_at?: string | null
          department?: string | null
          emergency_contact?: string | null
          employee_id?: string
          experience_years?: number | null
          id?: string
          is_class_teacher?: boolean | null
          joining_date?: string
          qualification?: string | null
          salary?: number | null
          status?: string | null
          subjects?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      timetables: {
        Row: {
          class_id: string
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean | null
          period_number: number
          room_number: string | null
          start_time: string
          subject_id: string
          teacher_id: string
          updated_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_active?: boolean | null
          period_number: number
          room_number?: string | null
          start_time: string
          subject_id: string
          teacher_id: string
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean | null
          period_number?: number
          room_number?: string | null
          start_time?: string
          subject_id?: string
          teacher_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_timetables_class"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_timetables_subject"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_timetables_teacher"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_teacher: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
