import { Column, CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity()
export abstract class Auditable {
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @Column({ name: "created_by" })
  createdBy!: number;

  @UpdateDateColumn({ name: "updated_at", nullable: true })
  updatedAt?: Date;

  @Column({ name: "updated_by", nullable: true })
  updatedBy?: number;

  @DeleteDateColumn({ name: "deleted_at", nullable: true })
  deletedAt?: Date;

  @Column({ name: "deleted_by", nullable: true })
  deletedBy?: number;
}
